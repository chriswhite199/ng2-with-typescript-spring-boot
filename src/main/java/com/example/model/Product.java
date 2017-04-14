package com.example.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class Product {
    int id;
    String title;
    float price;
    float rating;
    String description;
    List<String> categories = new ArrayList<String>();
}
