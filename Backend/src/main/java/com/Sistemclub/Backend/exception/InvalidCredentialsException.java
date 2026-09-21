package com.Sistemclub.Backend.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String mensagem) {
        super(mensagem);
    }
}