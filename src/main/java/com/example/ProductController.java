package com.example;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.BidMessage;
import com.example.model.Product;
import com.example.model.Review;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class ProductController {
    List<Product> products = new ArrayList<>();
    List<Review> reviews = new ArrayList<>();

    @Autowired
    private SimpMessagingTemplate msgTemplate;
    private ScheduledExecutorService exeService;

    @PostConstruct
    public void init() throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        this.products = mapper.readValue(new ClassPathResource("/products.json").getInputStream(),
                new TypeReference<List<Product>>() {
                });
        log.info("Loaded {} products", this.products.size());

        this.reviews = mapper.readValue(new ClassPathResource("/reviews.json").getInputStream(),
                new TypeReference<List<Review>>() {
                });
        log.info("Loaded {} reviews", this.reviews.size());

        log.info("Creating fake bids thread");
        exeService = Executors.newSingleThreadScheduledExecutor();
        exeService.scheduleAtFixedRate(() -> this.generateNewBids(), 5, 5, TimeUnit.SECONDS);
    }

    @PreDestroy
    public void destroy() throws InterruptedException {
        log.info("Stopping fake bids thread");
        this.exeService.shutdownNow();
        this.exeService.awaitTermination(1, TimeUnit.SECONDS);
        log.info("Stopped fake bids thread");
    }

    @GetMapping("/products")
    public List<Product> getProducts(@RequestParam(value = "title", required = false) String titleFilter,
            @RequestParam(value = "price", required = false) Float priceFilter,
            @RequestParam(value = "category", required = false) String catFilter) {

        Stream<Product> stream = products.stream();

        if (!StringUtils.isEmpty(titleFilter)) {
            stream = stream.filter(prod -> prod.getTitle().toLowerCase().contains(titleFilter.toLowerCase()));
        }
        if (priceFilter != null) {
            stream = stream.filter(prod -> prod.getPrice() <= priceFilter);
        }
        if (!StringUtils.isEmpty(catFilter)) {
            stream = stream.filter(prod -> prod.getCategories().stream()
                    .anyMatch(cat -> cat.toLowerCase().contains(catFilter.toLowerCase())));
        }

        return stream.collect(Collectors.toList());
    }

    @GetMapping("/products/{productId}")
    public Product getProductById(@PathVariable("productId") Integer productId) {
        log.info("Get product:{}", productId);
        return this.products.stream().filter(prod -> prod.getId() == productId.intValue()).findFirst().orElse(null);
    }

    @GetMapping("/products/{productId}/reviews")
    public List<Review> getReviewsForProductById(@PathVariable("productId") Integer productId) {
        return this.reviews.stream().filter(review -> review.getProductId() == productId.intValue())
                .collect(Collectors.toList());
    }

    @GetMapping("/categories")
    public List<String> getProductCategories() {
        return this.products.stream().flatMap(product -> product.getCategories().stream()).distinct()
                .collect(Collectors.toList());
    }

    Map<Integer, Float> currentBids = new HashMap<>();

    private void generateNewBids() {
        products.forEach(p -> {
            float currentBid = currentBids.getOrDefault(p.getId(), p.getPrice());
            float newBid = (float) (Math.random() * 5 + currentBid);
            currentBids.put(p.getId(), newBid);
            msgTemplate.convertAndSend("/topic/bids/" + p.getId(), new BidMessage(p.getId(), newBid));
        });
    }
}
