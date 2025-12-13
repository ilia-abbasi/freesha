import { body, param, query } from "express-validator";
import validator from "validator";

import { capitalize, isArrayUnique, isNone } from "../helpers/utils.js";

const nameValidator = () =>
  body("name")
    .trim()
    .notEmpty()
    .withMessage("نام ضروری است")
    .isString()
    .withMessage("نام باید یک رشته باشد")
    .isLength({ min: 6, max: 40 })
    .withMessage("نام کاربری باید بین 6 تا 40 کاراکتر باشد");

const emailValidator = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage("ایمیل ضروری است")
    .isString()
    .withMessage("ایمیل باید یک رشته باشد")
    .isLength({ max: 320 })
    .withMessage("ایمیل نباید بیش از 320 کاراکتر باشد")
    .isEmail()
    .withMessage("ایمیل باید معتبر باشد");

const passwordValidator = () =>
  body("password")
    .notEmpty()
    .withMessage("رمز عبور ضروری است")
    .isString()
    .withMessage("رمز عبور باید یک رشته باشد")
    .isLength({ max: 10_000 })
    .withMessage("حالت خوبه؟")
    .isStrongPassword()
    .withMessage("رمز عبور ضعیف است");

const otpValidator = () =>
  body("otp")
    .notEmpty()
    .withMessage("کد تائید ضروری است")
    .isString()
    .withMessage("کد تائید باید یک رشته باشد")
    .isLength({ min: 5, max: 5 })
    .withMessage("کد تائید باید دقیقا 5 کاراکتر باشد");

const userIdValidator = () =>
  param("userId")
    .notEmpty()
    .withMessage("آیدی کاربر ضروری است")
    .isInt({ min: 1 })
    .withMessage("آیدی کاربر باید یک عدد صحیح مثبت باشد")
    .toInt();

const postalCodeValidator = () =>
  body("postalCode")
    .trim()
    .isString()
    .withMessage("کد پستی باید یک رشته باشد")
    .isLength({ min: 10, max: 10 })
    .custom((value: string) => value.length === 0 || value.length === 10)
    .withMessage("کد پستی باید 10 یا 0 کاراکتر باشد")
    .isNumeric()
    .withMessage("کد پستی باید فقط شامل ارقام باشد");

const homeAddressValidator = () =>
  body("homeAddress")
    .trim()
    .isString()
    .withMessage("آدرس محل سکونت باید یک رشته باشد")
    .isLength({ max: 500 })
    .withMessage("آدرس محل سکونت نباید بیش از 500 کاراکتر باشد");

const genderIdValidator = () =>
  body("genderId")
    .notEmpty()
    .withMessage("جنسیت نمی تواند خالی باشد")
    .isInt({ min: 1, max: 3 })
    .withMessage("جنسیت باید عددی صحیح از 1 تا 3 باشد");

const jobTitleValidator = () =>
  body("jobTitle")
    .trim()
    .isString()
    .withMessage("عنوان شغلی باید یک رشته باشد")
    .isLength({ max: 50 })
    .withMessage("عنوان شغلی نباید بیش از 50 کاراکتر باشد");

const bioValidator = () =>
  body("bio")
    .trim()
    .isString()
    .withMessage("بیوگرافی باید یک رشته باشد")
    .isLength({ max: 400 })
    .withMessage("بیوگرافی نباید بیش از 400 کاراکتر باشد");

const birthDateValidator = () =>
  body("birthDate")
    .notEmpty()
    .withMessage("تاریخ تولد نمی تواند خالی باشد")
    .isString()
    .withMessage("تاریخ تولد باید یک رشته باشد")
    .isDate({ format: "YYYY-MM-DD", strictMode: true, delimiters: ["-"] })
    .withMessage("تاریخ تولد باید در فرمت YYYY-MM-DD باشد");

const skillsValidator = () =>
  body("skills")
    .isArray({ min: 0 })
    .withMessage("مهارت ها باید یک آرایه باشد")
    .custom(isArrayUnique)
    .withMessage("مهارت ها نباید تکراری باشند");

const skillsItemsValidator = () =>
  body("skills.*")
    .isString()
    .withMessage("درایه های مهارت ها باید رشته باشند")
    .isLength({ min: 1, max: 25 })
    .withMessage("درایه های مهارت ها باید بین 1 تا 25 کاراکتر باشند");

const languageNamesValidator = () =>
  body("languageNames")
    .isArray({ min: 0 })
    .withMessage("نام زبان ها باید یک آرایه باشد")
    .custom(isArrayUnique)
    .withMessage("نام زبان ها نباید تکراری باشند");

const languageNamesItemsValidator = () =>
  body("languageNames.*")
    .isString()
    .withMessage("درایه های نام زبان ها باید رشته باشند")
    .isLength({ max: 20 })
    .withMessage("درایه های نام زبان ها نباید بیش از 20 کاراکتر باشند")
    .customSanitizer(capitalize);

const socialLinksValidator = () =>
  body("socialLinks")
    .isArray({ min: 0 })
    .withMessage("لینک های اجتماعی باید یک آرایه باشد")
    .custom(isArrayUnique)
    .withMessage("لینک های اجتماعی نباید تکراری باشند");

const socialLinksItemsValidator = () =>
  body("socialLinks.*")
    .isString()
    .withMessage("درایه های لینک های اجتماعی باید رشته باشند")
    .isLength({ max: 100 })
    .withMessage("درایه های لینک های اجتماعی نباید بیش از 100 کاراکتر باشند")
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_valid_protocol: true,
      disallow_auth: true,
    })
    .withMessage("درایه های لینک های اجتماعی باید معتبر باشند");

const educationDegreesValidator = () =>
  body("educationDegrees")
    .isArray({ min: 0 })
    .withMessage("مدارک تحصیلی باید یک آرایه باشد");

const educationDegreesItemsValidator = () =>
  body("educationDegrees.*")
    .custom((value) => value.title)
    .withMessage("درایه های مدارک تحصیلی باید عنوان داشته باشند")
    .custom((value) => typeof value.title === "string")
    .withMessage("عنوان درایه های مدارک تحصیلی باید رشته باشد")
    .custom((value) => value.title.length <= 50)
    .withMessage("طول عنوان درایه های مدارک تحصیلی باید حداکثر 50 کاراکتر باشد")

    .custom((value) => value.startDate)
    .withMessage("درایه های مدارک تحصیلی باید تاریخ شروع داشته باشند")
    .custom((value) => typeof value.startDate === "string")
    .withMessage("تاریخ شروع درایه های مدارک تحصیلی باید رشته باشد")
    .custom((value) =>
      validator.isDate(value.startDate, {
        format: "YYYY-MM-DD",
        strictMode: true,
        delimiters: ["-"],
      })
    )
    .withMessage(
      "تاریخ شروع درایه های مدارک تحصیلی باید در فرمت YYYY-MM-DD باشد"
    )

    .custom((value) => {
      if (value.endDate === null) return true;
      if (typeof value.endDate !== "string") return false;
      return validator.isDate(value.endDate, {
        format: "YYYY-MM-DD",
        strictMode: true,
        delimiters: ["-"],
      });
    })
    .withMessage(
      "تاریخ پایان درایه های مدارک تحصیلی یا باید نال باشد یا در فرمت YYYY-MM-DD باشد"
    )

    .custom((value) => Object.keys(value).length === 3)
    .withMessage("درایه های مدارک تحصیلی باید دقیقا 3 کلید داشته باشند");

const workExperiencesValidator = () =>
  body("workExperiences")
    .isArray({ min: 0 })
    .withMessage("سوابق شغلی باید یک آرایه باشد");

const workExperiencesItemsValidator = () =>
  body("workExperiences.*")
    .custom((value) => value.jobTitle)
    .withMessage("درایه های سوابق شفلی باید عنوان شفلی داشته باشند")
    .custom((value) => typeof value.jobTitle === "string")
    .withMessage("عنوان شفلی درایه های سوابق شفلی باید رشته باشد")
    .custom((value) => value.jobTitle.length <= 50)
    .withMessage(
      "طول عنوان شفلی درایه های سوابق شفلی باید حداکثر 50 کاراکتر باشد"
    )

    .custom((value) => value.company)
    .withMessage("درایه های سوابق شفلی باید نام شرکت داشته باشند")
    .custom((value) => typeof value.company === "string")
    .withMessage("نام شرکت درایه های سوابق شفلی باید رشته باشد")
    .custom((value) => value.company.length <= 50)
    .withMessage(
      "طول نام شرکت درایه های سوابق شفلی باید حداکثر 50 کاراکتر باشد"
    )

    .custom((value) => !isNone(value.description))
    .withMessage("درایه های سوابق شفلی باید توضیحات داشته باشند")
    .custom((value) => typeof value.description === "string")
    .withMessage("توضیحات درایه های سوابق شفلی باید رشته باشد")
    .custom((value) => value.description.length <= 500)
    .withMessage(
      "طول توضیحات درایه های سوابق شفلی باید حداکثر 500 کاراکتر باشد"
    )

    .custom((value) => value.startDate)
    .withMessage("درایه های سوابق شفلی باید تاریخ شروع داشته باشند")
    .custom((value) => typeof value.startDate === "string")
    .withMessage("تاریخ شروع درایه های سوابق شفلی باید رشته باشد")
    .custom((value) =>
      validator.isDate(value.startDate, {
        format: "YYYY-MM-DD",
        strictMode: true,
        delimiters: ["-"],
      })
    )
    .withMessage("تاریخ شروع درایه های سوابق شفلی باید در فرمت YYYY-MM-DD باشد")

    .custom((value) => {
      if (value.endDate === null) return true;
      if (typeof value.endDate !== "string") return false;
      return validator.isDate(value.endDate, {
        format: "YYYY-MM-DD",
        strictMode: true,
        delimiters: ["-"],
      });
    })
    .withMessage(
      "تاریخ پایان درایه های سوابق شفلی یا باید نال باشد یا در فرمت YYYY-MM-DD باشد"
    )

    .custom((value) => Object.keys(value).length === 5)
    .withMessage("درایه های سوابق شغلی باید دقیقا 5 کلید داشته باشند");

const fieldsValidator = () =>
  query("fields")
    .trim()
    .isString()
    .withMessage("فیلد ها باید یک رشته باشد")
    .custom((value) => !isNone(value))
    .withMessage("حداقل یک فیلد باید تعیین شود")
    .customSanitizer((value: string) =>
      value.split(",").map((value) => value.trim())
    );

const titleValidator = () =>
  body("title")
    .trim()
    .notEmpty()
    .withMessage("عنوان نباید خالی باشد")
    .isString()
    .withMessage("عنوان باید یک رشته باشد")
    .isLength({ min: 5, max: 60 })
    .withMessage("طول عنوان باید بین 5 تا 60 کاراکتر باشد");

const descriptionValidator = () =>
  body("description")
    .trim()
    .notEmpty()
    .withMessage("توضیحات نباید خالی باشد")
    .isString()
    .withMessage("توضیحات باید یک رشته باشد")
    .isLength({ min: 30, max: 5000 })
    .withMessage("طول توضیحات باید بین 30 تا 5000 کاراکتر باشد");

const budgetLowValidator = () =>
  body("budget_low")
    .trim()
    .notEmpty()
    .withMessage("کف بودجه نباید خالی باشد")
    .isInt({ min: 500_000, max: 1_000_000_000 })
    .withMessage(
      "کف بودجه باید عددی بین 500،000 ریال تا 1،000،000،000 ریال باشد"
    );

const budgetHighValidator = () =>
  body("budget_high")
    .trim()
    .notEmpty()
    .withMessage("سقف بودجه نباید خالی باشد")
    .isInt({ min: 500_000, max: 1_000_000_000 })
    .withMessage(
      "سقف بودجه باید عددی بین 500،000 ریال تا 1،000،000،000 ریال باشد"
    );

export const registerValidator = () => [
  nameValidator(),
  emailValidator(),
  passwordValidator(),
];

export const verifyemailValidator = () => [emailValidator(), otpValidator()];

export const loginValidator = () => [emailValidator(), passwordValidator()];

export const updateUserValidator = () => [
  userIdValidator(),

  nameValidator().optional(),

  postalCodeValidator().optional(),
  homeAddressValidator().optional(),
  genderIdValidator().optional(),
  jobTitleValidator().optional(),
  bioValidator().optional(),
  birthDateValidator().optional(),

  skillsValidator().optional(),
  skillsItemsValidator().optional(),
  languageNamesValidator().optional(),
  languageNamesItemsValidator().optional(),
  socialLinksValidator().optional(),
  socialLinksItemsValidator().optional(),

  educationDegreesValidator().optional(),
  educationDegreesItemsValidator().optional(),
  workExperiencesValidator().optional(),
  workExperiencesItemsValidator().optional(),
];

export const getUserValidator = () => [userIdValidator(), fieldsValidator()];
