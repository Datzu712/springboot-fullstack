package com.web.server.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.server.models.Client;
import com.web.server.repositories.ClientRepository;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientRepository clientRepository = new ClientRepository();
    
    @GetMapping()
    public Client[] getClients() {
        return this.clientRepository.findAll();
    }

    @PostMapping
    public void createClient(@RequestBody Client client) {
        this.clientRepository.insertOne(client);
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable int id) {
        this.clientRepository.deleteOneById(id);
    }
}
