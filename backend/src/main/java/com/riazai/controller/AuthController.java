package com.riazai.controller;

import com.riazai.model.User;
import com.riazai.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> processSignup(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "That username is already taken. Please choose another."));
        }
        User user = new User(username, passwordEncoder.encode(password));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "User created successfully."));
    }
}
