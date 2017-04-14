package com.example;

import java.io.IOException;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;

import com.example.model.Product;
import com.example.model.Review;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public class ProductControllerTest {
    private ProductController productController = new ProductController();

    @Before
    public void setup() throws JsonParseException, JsonMappingException, IOException {
        productController = new ProductController();
        productController.init();
    }

    @Test
    public void allProducts() throws Exception {
        List<Product> products = productController.getProducts(null, null, null);
        Assertions.assertThat(products).hasSize(6).extracting("id").contains(0, 1, 2, 3, 4, 5);
    }

    @Test
    public void productsFilteredByTitle() throws Exception {
        List<Product> products = productController.getProducts("th", null, null);
        Assertions.assertThat(products).hasSize(4).extracting("id").contains(2, 3, 4, 5);
    }

    @Test
    public void productsFilteredByPrice() throws Exception {
        List<Product> products = productController.getProducts(null, 50f, null);
        Assertions.assertThat(products).hasSize(1).extracting("id").contains(0);
    }

    @Test
    public void productsFilteredByCategory() throws Exception {
        List<Product> products = productController.getProducts(null, null, "Hardware");
        Assertions.assertThat(products).hasSize(3).extracting("id").contains(0, 3, 4);
    }

    @Test
    public void productsMultiFiltered() throws Exception {
        List<Product> products = productController.getProducts("th", 90f, null);
        Assertions.assertThat(products).hasSize(3).extracting("id").contains(2, 3, 5);
    }

    @Test
    public void productById() throws Exception {
        Product product = productController.getProductById(0);
        Assertions.assertThat(product).hasFieldOrPropertyWithValue("title", "First Product");
    }
    
    @Test
    public void productByUnknownId() throws Exception {
        Product product = productController.getProductById(123);
        Assertions.assertThat(product).isNull();
    }

    @Test
    public void productReviews() throws Exception {
        List<Review> reviews = productController.getReviewsForProductById(0);
        Assertions.assertThat(reviews).hasSize(4).extracting("id").contains(0, 1, 2, 3);
    }

    @Test
    public void getCategories() {
        List<String> categories = productController.getProductCategories();
        Assertions.assertThat(categories).hasSize(3).contains("books", "electronics", "hardware");
    }
}
