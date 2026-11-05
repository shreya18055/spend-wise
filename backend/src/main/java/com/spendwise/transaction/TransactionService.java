package com.spendwise.transaction;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> findAll() {
        return repository.findAllByOrderByTransactionDateDesc();
    }

    public Transaction findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Transaction " + id + " was not found"));
    }

    public Transaction create(TransactionRequest request) {
        return repository.save(new Transaction(
                request.description(), request.category(), request.amount(),
                request.type(), request.transactionDate()));
    }

    public Transaction update(Long id, TransactionRequest request) {
        Transaction transaction = findById(id);
        transaction.update(request.description(), request.category(), request.amount(),
                request.type(), request.transactionDate());
        return repository.save(transaction);
    }

    public void delete(Long id) {
        Transaction transaction = findById(id);
        repository.delete(transaction);
    }

    public Summary summary() {
        List<Transaction> all = repository.findAll();
        BigDecimal income = all.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expenses = all.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new Summary(income, expenses, income.subtract(expenses));
    }

    public record Summary(BigDecimal totalIncome, BigDecimal totalExpenses,
                          BigDecimal balance) {}
}
