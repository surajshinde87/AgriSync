package com.agrisync.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // hashed

    @Column(nullable = false)
    private String role; // FARMER / BUYER / DRIVER

    @Builder.Default
    @Column
    private Boolean verified = false;

    @Column
    private String city;

    @Column
    private String state;

    @Column
    private String pincode;
}
