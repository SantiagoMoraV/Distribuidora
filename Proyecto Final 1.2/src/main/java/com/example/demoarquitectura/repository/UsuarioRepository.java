package com.example.demoarquitectura.repository;

import com.example.demoarquitectura.repository.crud.UsuarioCrudRepository;
import com.example.demoarquitectura.entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    @Autowired
    UsuarioCrudRepository usuarioCrudRepository;

    public List<Usuario> getAll(){
        return (List<Usuario>) usuarioCrudRepository.findAll();
    }

    public Optional<Usuario> findByEmail (String email){
        return usuarioCrudRepository.findByEmail(email);
    }
    public Optional<Usuario> findById (int i){
        return usuarioCrudRepository.findById(i);
    }
    public Usuario save (Usuario u) {return usuarioCrudRepository.save(u);}
}
