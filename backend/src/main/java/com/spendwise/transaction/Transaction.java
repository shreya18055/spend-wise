package com.spendwise.transaction;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String description;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionType type;

    @Column(nullable = false)
    private LocalDate transactionDate;

    protected Transaction() {}

    public Transaction(String description, String category, BigDecimal amount,
                       TransactionType type, LocalDate transactionDate) {
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.type = type;
        this.transactionDate = transactionDate;
    }

    public Long getId() { return id; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public BigDecimal getAmount() { return amount; }
    public TransactionType getType() { return type; }
    public LocalDate getTransactionDate() { return transactionDate; }

    public void update(String description, String category, BigDecimal amount,
                       TransactionType type, LocalDate transactionDate) {
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.type = type;
        this.transactionDate = transactionDate;
    }
}
