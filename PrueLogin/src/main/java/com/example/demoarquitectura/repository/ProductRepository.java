package com.example.demoarquitectura.repository;

import com.example.demoarquitectura.entity.Product;
import com.example.demoarquitectura.repository.crud.ProductCrudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductRepository {

    @Autowired
    private ProductCrudRepository productCrudRepository;

    public List<Product> getAll(){
        return (List<Product>) productCrudRepository.findAll();
    }

    public Product save(Product p){
        return productCrudRepository.save(p);
    }

    public Product getById(Integer id){
        Optional<Product> res=productCrudRepository.findById(id);
        if(res.isPresent()){
            return res.get();
        }else{
            return null;
        }
        
    }

}
