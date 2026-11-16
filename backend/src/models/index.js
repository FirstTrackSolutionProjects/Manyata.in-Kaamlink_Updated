import { sequelize } from "../config/sequelize.js";
import { DataTypes } from "sequelize";

import UserModel from "./user.js";
import CityModel from "./city.js";
import PincodeModel from "./pincode.js";
import ServiceCategoryModel from "./serviceCategory.js";
import ServiceModel from "./service.js";
import ProfessionalModel from "./professional.js";
import ProfessionalServiceModel from "./professionalService.js";
import RefreshTokenModel from "./refreshToken.js";
import ContactMessageModel from "./contactMessage.js"; 
import BookingModel from "./booking.js";
import NewsletterSubscriptionModel from "./newsletterSubscription.js";
import SupportTicketModel from "./supportTicket.js";


const User = UserModel(sequelize, DataTypes);
const City = CityModel(sequelize, DataTypes);
const Pincode = PincodeModel(sequelize, DataTypes);
const ServiceCategory = ServiceCategoryModel(sequelize, DataTypes);
const Service = ServiceModel(sequelize, DataTypes);
const Professional = ProfessionalModel(sequelize, DataTypes);
const ProfessionalService = ProfessionalServiceModel(sequelize, DataTypes);
const RefreshToken = RefreshTokenModel(sequelize, DataTypes);

// FIXED: Removed the "db." and added DataTypes
const ContactMessage = ContactMessageModel(sequelize, DataTypes);
const Booking = BookingModel(sequelize, DataTypes);
const NewsletterSubscription = NewsletterSubscriptionModel(sequelize, DataTypes);
const SupportTicket = SupportTicketModel(sequelize, DataTypes);
/* ---------------- Associations ---------------- */

// City ↔ Pincode
City.hasMany(Pincode, { foreignKey: "city_id", onDelete: "CASCADE" });
Pincode.belongsTo(City, { foreignKey: "city_id" });

// ServiceCategory ↔ Service
ServiceCategory.hasMany(Service, { foreignKey: "category_id", onDelete: "CASCADE" });
Service.belongsTo(ServiceCategory, { foreignKey: "category_id", as: "category" });

// User ↔ Professional (1:1)
User.hasOne(Professional, { foreignKey: "user_id", onDelete: "CASCADE" });
Professional.belongsTo(User, { foreignKey: "user_id", as: "user" });

// City ↔ Professional
City.hasMany(Professional, { foreignKey: "city_id", onDelete: "SET NULL" });
Professional.belongsTo(City, { foreignKey: "city_id", as: "city" });

// Professional ↔ ServiceCategory (M:N through professional_services)
Professional.belongsToMany(ServiceCategory, {
  through: ProfessionalService,
  foreignKey: "professional_id",
  otherKey: "category_id",
  as: "categories",
});
ServiceCategory.belongsToMany(Professional, {
  through: ProfessionalService,
  foreignKey: "category_id",
  otherKey: "professional_id",
  as: "professionals",
});

// User ↔ RefreshToken
User.hasMany(RefreshToken, { foreignKey: "user_id", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "user_id" });
 
// User ↔ Booking
User.hasMany(Booking, { foreignKey: "user_id", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Service ↔ Booking
Service.hasMany(Booking, { foreignKey: "service_id" });
Booking.belongsTo(Service, { foreignKey: "service_id", as: "service" });
/* ---------------- Export ---------------- */

export {
  sequelize,
  User,
  City,
  Pincode,
  ServiceCategory,
  Service,
  Professional,
  ProfessionalService,
  RefreshToken,
  ContactMessage,
  Booking, // FIXED: Added this to exports
  NewsletterSubscription,
  SupportTicket,
};
