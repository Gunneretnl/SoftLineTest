using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace SoftLineTest.Models
{
    public class CpfCnpjAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            string documento = value as string;
            if (string.IsNullOrEmpty(documento))
                return new ValidationResult("Documento é obrigatório");

            documento = Regex.Replace(documento, @"[^\d]", "");

            if (documento.Length == 11)
            {
                if (!IsCpfValido(documento))
                    return new ValidationResult("CPF inválido");
            }
            else if (documento.Length == 14)
            {
                if (!IsCnpjValido(documento))
                    return new ValidationResult("CNPJ inválido");
            }
            else
            {
                return new ValidationResult("Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos");
            }

            return ValidationResult.Success;
        }

        private bool IsCpfValido(string cpf)
        {
            int[] mult1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] mult2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            if (new string(cpf[0], 11) == cpf) return false;

            int soma = 0;
            for (int i = 0; i < 9; i++) soma += (cpf[i] - '0') * mult1[i];
            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            soma = 0;
            for (int i = 0; i < 10; i++) soma += (cpf[i] - '0') * mult2[i];
            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            return cpf[9] - '0' == digito1 && cpf[10] - '0' == digito2;
        }

        private bool IsCnpjValido(string cnpj)
        {
            int[] mult1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] mult2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            if (new string(cnpj[0], 14) == cnpj) return false;

            int soma = 0;
            for (int i = 0; i < 12; i++) soma += (cnpj[i] - '0') * mult1[i];
            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            soma = 0;
            for (int i = 0; i < 13; i++) soma += (cnpj[i] - '0') * mult2[i];
            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            return cnpj[12] - '0' == digito1 && cnpj[13] - '0' == digito2;
        }
    }
}