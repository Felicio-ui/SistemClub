package com.Sistemclub.Backend.exception;

public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String mensagem) {
        super(mensagem);
    }
}