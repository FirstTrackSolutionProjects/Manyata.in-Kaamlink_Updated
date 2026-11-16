import { Service } from "../../models/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllServices = asyncHandler(async (req, res) => {
  // Fetch all active services from MySQL
  const services = await Service.findAll({ 
    where: { is_active: true } 
  });
  
  res.status(200).json({ success: true, data: services });
});