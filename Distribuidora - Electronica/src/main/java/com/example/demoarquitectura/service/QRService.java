package com.example.demoarquitectura.service;

import com.example.demoarquitectura.entity.QR;
import com.example.demoarquitectura.repository.crud.QRCrudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QRService {

    @Autowired
    private QRCrudRepository qrRepository;

    public List<QR> getAll() {
        return (List<QR>) qrRepository.findAll();
    }

    public QR save(QR qr) {
        return qrRepository.save(qr);
    }
}
