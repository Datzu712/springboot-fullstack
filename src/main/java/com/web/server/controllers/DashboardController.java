package com.web.server.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    @GetMapping("/")
    public String get() {
        return "dashboard";
    }

    @GetMapping("/clients")
    public String getClients() {
        return "clients";
    }
}

