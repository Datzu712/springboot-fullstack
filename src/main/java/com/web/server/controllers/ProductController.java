package com.web.server.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.server.models.Product;
import com.web.server.repositories.ProductRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository = new ProductRepository();

    @GetMapping()
    public Product[] getProducts() {
        return this.productRepository.findAll();
    }

    @PostMapping()
    public void createProduct(@RequestBody Product product) {
        this.productRepository.insertOne(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable int id) {
        this.productRepository.deleteOneById(id);
    }

    @PatchMapping("/{id}")
    public void updateProduct(@PathVariable int id, @RequestBody Product product) {
        this.productRepository.updateOneById(id, product);
    }
}
