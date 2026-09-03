import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { createTransactionSchema } from "../validators/transaction.validator.js";
import { HttpError } from "../utils/httpError.js";

function money(value: number) {
  return Number(value.toFixed(2));
}

export async function createTransaction(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, "You are not authenticated");
  }

  const data = createTransactionSchema.parse(req.body);
  const calculatedItems = data.items.map((item) => ({
    itemName: item.itemName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: money(item.quantity * item.unitPrice)
  }));

  const subtotal = money(calculatedItems.reduce((sum, item) => sum + item.amount, 0));
  const discount = money(Math.min(data.discount, subtotal));
  const discountedSubtotal = money(subtotal - discount);
  const taxAmount = money(discountedSubtotal * (data.taxRate / 100));
  const totalAmount = money(discountedSubtotal + taxAmount);

  const saved = await prisma.$transaction(async (tx) => {
    let transactionNumber = `TRX-${String((await tx.transaction.count()) + 1).padStart(6, "0")}`;
    let suffix = 1;

    while (await tx.transaction.findUnique({ where: { transactionNumber } })) {
      suffix += 1;
      transactionNumber = `TRX-${String((await tx.transaction.count()) + suffix).padStart(6, "0")}`;
    }

    return tx.transaction.create({
      data: {
        transactionNumber,
        employeeId: req.user!.id,
        totalAmount,
        items: {
          create: calculatedItems
        }
      },
      include: {
        employee: { select: { id: true, name: true, email: true, role: true } },
        items: true
      }
    });
  });

  res.status(201).json({ transaction: saved });
}
