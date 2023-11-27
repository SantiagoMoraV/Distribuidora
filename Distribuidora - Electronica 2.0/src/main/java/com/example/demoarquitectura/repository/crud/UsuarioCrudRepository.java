package com.example.demoarquitectura.repository.crud;

import com.example.demoarquitectura.entity.Usuario;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UsuarioCrudRepository extends CrudRepository<Usuario,Integer> {

    public Optional<Usuario> findByEmail (String email);

}
