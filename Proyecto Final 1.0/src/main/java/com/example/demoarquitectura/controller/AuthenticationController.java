package com.example.demoarquitectura.controller;

import com.example.demoarquitectura.Auth.AuthenticationRequest;
import com.example.demoarquitectura.Auth.AuthenticationResponse;
import com.example.demoarquitectura.Auth.RegisterRequest;
import com.example.demoarquitectura.entity.Usuario;
import com.example.demoarquitectura.repository.crud.UsuarioCrudRepository;
import com.example.demoarquitectura.seguridad.JwtService;
import com.example.demoarquitectura.service.AuthenticationService;
import com.example.demoarquitectura.service.UsuarioService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;
    private final UsuarioService usuarioService;
    private final UsuarioCrudRepository repository;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        if(!request.getFirstname().isBlank() && !request.getLastname().isBlank() && !request.getEmail().isBlank() && !request.getPassword().isBlank() && !repository.findByEmail(request.getEmail()).isPresent()){
            return ResponseEntity.ok(service.register(request));
        }else {
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).build();
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authentication(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/all")
    public List<Usuario> all() {return usuarioService.getAll();}

    @GetMapping("/current")
    public ResponseEntity<Usuario> getCurrentUser(HttpServletRequest request) {
        String authToken = request.getHeader("Authorization");
        String token = authToken.substring(7); // Eliminar "Bearer " del token
        String userEmail = jwtService.extractUsername(token);

        Usuario currentUser = repository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        return ResponseEntity.ok(currentUser);
    }

}
