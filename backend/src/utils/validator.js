const { z } = require('zod');

const transactionSchema = z.object({
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  currency: z.string().default('PKR'),
  type: z.enum(['expense', 'income', 'debt_given', 'debt_received'], {
    errorMap: () => ({ message: "Invalid transaction type" }),
  }),
  person: z.string().nullable().optional(),
  description: z.string(),
  confidence: z.number().optional(),
});

function validateExtractedData(data) {
  return transactionSchema.safeParse(data);
}

module.exports = { validateExtractedData };
