package com.web.server.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.server.models.Sale;
import com.web.server.repositories.SaleRepository;

@RestController
@RequestMapping("/api/sales")
public class SaleController {
    private final SaleRepository saleRepository = new SaleRepository();

    @GetMapping()
    public Sale[] getSales() {
        return this.saleRepository.findAll();
    }

    @PostMapping()
    public void createSale(@RequestBody Sale sale) {
        this.saleRepository.insertOne(sale);
    }

    @DeleteMapping("/{id}")
    public void deleteSale(@PathVariable int id) {
        this.saleRepository.deleteOneById(id);
    }

    @PatchMapping("/{id}")
    public void updateSale(@PathVariable int id, @RequestBody Sale sale) {
        this.saleRepository.updateOneById(id, sale);
    }
}
