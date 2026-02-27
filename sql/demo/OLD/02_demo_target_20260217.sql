CREATE TABLE public.accounts (
    account_id INT PRIMARY KEY,
    balance NUMERIC(12,2)
);

INSERT INTO public.accounts VALUES
(1, 1000.00),
(2, 2000.00),
(3, 1400.00); -- Intentional mismatch