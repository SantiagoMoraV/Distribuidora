package com.example.demoarquitectura.service;

import com.example.demoarquitectura.entity.Usuario;
import com.example.demoarquitectura.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAll(){
        return usuarioRepository.getAll();
    }
    public Optional<Usuario> findById (int i){ return  usuarioRepository.findById(i);}

}
