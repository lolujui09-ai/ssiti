import { FormSchema, ValidationResult, ValidationError, FieldType } from '../types/schema';

const ALLOWED_TYPES: FieldType[] = [
  'text',
  'email',
  'number',
  'date',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'file',
  'tel',
  'url',
  'password',
  'time'
];

/**
 * Parses and validates the raw JSON schema text
 */
export function validateFormSchema(rawJson: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!rawJson || rawJson.trim() === '') {
    return {
      isValid: false,
      errors: [{ message: 'Schema JSON masih kosong. Silakan paste schema atau pilih template contoh.', type: 'error' }],
      warnings: [],
      parsedSchema: null,
    };
  }

  // 1. JSON Syntax Check
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err: any) {
    const errorMsg = err.message || 'Format JSON tidak valid';
    let line: number | undefined;

    // Try to extract line number from error message (e.g. "at position X" or "line Y")
    const lineMatch = errorMsg.match(/line\s+(\d+)/i);
    if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
    } else {
      const posMatch = errorMsg.match(/position\s+(\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        line = rawJson.substring(0, pos).split('\n').length;
      }
    }

    return {
      isValid: false,
      errors: [
        {
          message: `Sintaks JSON tidak valid: ${errorMsg}`,
          type: 'error',
          line,
        },
      ],
      warnings: [],
      parsedSchema: null,
    };
  }

  // 2. Root Structure Check
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: false,
      errors: [{ message: 'Root schema harus berupa JSON Object `{ ... }`, bukan Array atau tipe primitif.', type: 'error' }],
      warnings: [],
      parsedSchema: null,
    };
  }

  // Title check
  if (!parsed.title || typeof parsed.title !== 'string' || parsed.title.trim() === '') {
    errors.push({
      message: 'Properti "title" wajib diisi dengan string judul form yang jelas.',
      type: 'error',
    });
  }

  // Fields check
  if (!parsed.fields) {
    errors.push({
      message: 'Properti "fields" wajib ada dan berupa array daftar field input.',
      type: 'error',
    });
  } else if (!Array.isArray(parsed.fields)) {
    errors.push({
      message: 'Properti "fields" harus berupa array [ { ... }, { ... } ].',
      type: 'error',
    });
  } else if (parsed.fields.length === 0) {
    errors.push({
      message: 'Array "fields" tidak boleh kosong. Minimal sediakan 1 field input.',
      type: 'error',
    });
  }

  // If root errors already fatal, return early
  if (errors.length > 0 && !Array.isArray(parsed.fields)) {
    return {
      isValid: false,
      errors,
      warnings,
      parsedSchema: null,
    };
  }

  // 3. Detailed Fields Validation
  const seenIds = new Set<string>();

  if (Array.isArray(parsed.fields)) {
    parsed.fields.forEach((field: any, index: number) => {
      const fieldNum = index + 1;

      if (typeof field !== 'object' || field === null) {
        errors.push({
          fieldIndex: index,
          message: `Field #${fieldNum} harus berupa objek.`,
          type: 'error',
        });
        return;
      }

      // Check field ID
      const fieldId = field.id || field.name;
      if (!fieldId || typeof fieldId !== 'string' || fieldId.trim() === '') {
        errors.push({
          fieldIndex: index,
          message: `Field #${fieldNum}: Properti "id" (atau "name") wajib diisi dan berupa string unik.`,
          type: 'error',
        });
      } else {
        const trimmedId = fieldId.trim();
        if (seenIds.has(trimmedId)) {
          errors.push({
            fieldIndex: index,
            fieldId: trimmedId,
            message: `Field #${fieldNum}: ID "${trimmedId}" terduplikasi! Setiap field wajib memiliki ID yang unik.`,
            type: 'error',
          });
        } else {
          seenIds.add(trimmedId);
        }

        // Warning for weird characters in id
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmedId)) {
          warnings.push({
            fieldIndex: index,
            fieldId: trimmedId,
            message: `Field #${fieldNum} ("${trimmedId}"): Disarankan menggunakan ID alfanumerik standar (contoh: "namaLengkap" atau "email_user").`,
            type: 'warning',
          });
        }
      }

      // Check label
      if (!field.label || typeof field.label !== 'string' || field.label.trim() === '') {
        errors.push({
          fieldIndex: index,
          fieldId: field.id,
          message: `Field #${fieldNum} ("${field.id || 'tanpa id'}"): Properti "label" wajib diisi dengan string deskriptif.`,
          type: 'error',
        });
      }

      // Check type
      if (!field.type || typeof field.type !== 'string') {
        errors.push({
          fieldIndex: index,
          fieldId: field.id,
          message: `Field #${fieldNum}: Properti "type" wajib ditentukan (contoh: text, email, number, date, select, radio, checkbox, textarea, file).`,
          type: 'error',
        });
      } else {
        const lowerType = field.type.toLowerCase() as FieldType;
        if (!ALLOWED_TYPES.includes(lowerType)) {
          errors.push({
            fieldIndex: index,
            fieldId: field.id,
            message: `Field #${fieldNum}: Tipe "${field.type}" tidak didukung. Tipe yang diperbolehkan: ${ALLOWED_TYPES.join(', ')}.`,
            type: 'error',
          });
        } else {
          // Normalize type
          field.type = lowerType;

          // Type-specific checks:
          // 1. SELECT and RADIO must have options
          if (lowerType === 'select' || lowerType === 'radio') {
            if (!field.options || !Array.isArray(field.options) || field.options.length === 0) {
              errors.push({
                fieldIndex: index,
                fieldId: field.id,
                message: `Field #${fieldNum} ("${field.label || field.id}") bertipe "${lowerType}" memerlukan array "options" dengan minimal 1 pilihan: [{"label": "...", "value": "..."}].`,
                type: 'error',
              });
            } else {
              field.options.forEach((opt: any, optIdx: number) => {
                if (typeof opt !== 'object' || opt === null || typeof opt.label === 'undefined' || typeof opt.value === 'undefined') {
                  errors.push({
                    fieldIndex: index,
                    fieldId: field.id,
                    message: `Field #${fieldNum} ("${field.id}"): Opsi ke-${optIdx + 1} harus berupa objek dengan properti "label" dan "value".`,
                    type: 'error',
                  });
                }
              });
            }
          }

          // 2. CHECKBOX: if options provided, validate them; if not, it acts as single boolean checkbox
          if (lowerType === 'checkbox' && field.options) {
            if (!Array.isArray(field.options) || field.options.length === 0) {
              warnings.push({
                fieldIndex: index,
                fieldId: field.id,
                message: `Field #${fieldNum} ("${field.id}"): Array options kosong. Checkbox akan dirender sebagai single checkbox persetujuan.`,
                type: 'warning',
              });
            } else {
              field.options.forEach((opt: any, optIdx: number) => {
                if (typeof opt !== 'object' || opt === null || typeof opt.label === 'undefined' || typeof opt.value === 'undefined') {
                  errors.push({
                    fieldIndex: index,
                    fieldId: field.id,
                    message: `Field #${fieldNum} ("${field.id}"): Opsi checkbox ke-${optIdx + 1} harus memiliki "label" dan "value".`,
                    type: 'error',
                  });
                }
              });
            }
          }

          // 3. NUMBER: min & max
          if (lowerType === 'number') {
            if (typeof field.min === 'number' && typeof field.max === 'number' && field.min > field.max) {
              errors.push({
                fieldIndex: index,
                fieldId: field.id,
                message: `Field #${fieldNum} ("${field.id}"): Nilai "min" (${field.min}) tidak boleh lebih besar dari "max" (${field.max}).`,
                type: 'error',
              });
            }
          }

          // 4. TEXT / TEXTAREA: minLength & maxLength
          if (typeof field.minLength === 'number' && typeof field.maxLength === 'number' && field.minLength > field.maxLength) {
            errors.push({
              fieldIndex: index,
              fieldId: field.id,
              message: `Field #${fieldNum} ("${field.id}"): "minLength" (${field.minLength}) tidak boleh lebih besar dari "maxLength" (${field.maxLength}).`,
              type: 'error',
            });
          }

          // 5. FILE: accept format
          if (lowerType === 'file' && field.accept && typeof field.accept !== 'string') {
            warnings.push({
              fieldIndex: index,
              fieldId: field.id,
              message: `Field #${fieldNum} ("${field.id}"): Properti "accept" sebaiknya berupa string ekstensi atau MIME type (contoh: ".pdf,.png" atau "image/*").`,
              type: 'warning',
            });
          }
        }
      }
    });
  }

  // General warnings
  if (!parsed.description) {
    warnings.push({
      message: 'Tips: Tambahkan properti "description" pada schema untuk memberikan instruksi singkat kepada pengisi form.',
      type: 'warning',
    });
  }

  if (!parsed.submitButtonText) {
    parsed.submitButtonText = 'Kirim Formulir';
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    parsedSchema: isValid ? (parsed as FormSchema) : null,
  };
}
