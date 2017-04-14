package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BidMessage {
    private int productId;
    private float newBid;
}
