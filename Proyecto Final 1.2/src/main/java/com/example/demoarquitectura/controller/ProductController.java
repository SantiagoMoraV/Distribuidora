package com.example.demoarquitectura.controller;

import com.example.demoarquitectura.entity.Product;
import com.example.demoarquitectura.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;
    @GetMapping("/hola")
    public String saludar(){
        return "Hola Mundo!!";
    }

    @PostMapping("/save")
    public Product save(@RequestBody Product p){
        return productService.save(p);
    }

    @GetMapping("/all")
    public List<Product> getAll(){
        return productService.getAll();
    }

    @GetMapping("/id/{id}")
    public Product getById(@PathVariable("id") Integer id){
        return productService.getById(id);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") Integer id) {
        Product product = productService.getById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/up/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable("id") Integer id,
            @RequestBody Product updatedProduct
    ) {
        Product existingProduct = productService.getById(id);
        if (existingProduct != null) {
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            productService.save(existingProduct);
            return ResponseEntity.ok(existingProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Integer id) {
        Product existingProduct = productService.getById(id);
        if (existingProduct != null) {
            productService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
