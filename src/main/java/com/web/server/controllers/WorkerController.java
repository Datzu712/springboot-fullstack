package com.web.server.controllers;

import org.springframework.web.bind.annotation.*;
import com.web.server.models.Worker;
import com.web.server.repositories.WorkerRepository;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {
    private final WorkerRepository workerRepository = new WorkerRepository();

    @GetMapping()
    public Worker[] getWorkers() {
        return this.workerRepository.findAll();
    }

    @PostMapping()
    public void createWorker(@RequestBody Worker worker) {
        this.workerRepository.insertOne(worker);
    }

    @DeleteMapping("/{id}")
    public void deleteWorker(@PathVariable int id) {
        this.workerRepository.deleteOneById(id);
    }

    @PatchMapping("/{id}")
    public void updateWorker(@PathVariable int id, @RequestBody Worker worker) {
        this.workerRepository.updateOneById(id, worker);
    }
}
