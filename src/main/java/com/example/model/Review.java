package com.example.model;

import java.util.Date;

import lombok.Data;

@Data
public class Review {
    int id;
    int productId;
    Date timestamp;
    String user;
    float rating;
    String comment;
}
