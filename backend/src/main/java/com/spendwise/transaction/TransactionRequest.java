package com.spendwise.transaction;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotBlank @Size(max = 100) String description,
        @NotBlank @Size(max = 60) String category,
        @NotNull @DecimalMin(value = "0.01") @Digits(integer = 10, fraction = 2)
        BigDecimal amount,
        @NotNull TransactionType type,
        @NotNull @PastOrPresent LocalDate transactionDate
) {}
