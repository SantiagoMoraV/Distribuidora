package com.example.demoarquitectura.repository.crud;

import com.example.demoarquitectura.entity.Product;
import org.springframework.data.repository.CrudRepository;

public interface ProductCrudRepository extends CrudRepository<Product,Integer> {

    // Método para actualizar un producto
    Product save(Product product);

    // Método para eliminar un producto por su ID
    void deleteById(Integer id);
}

