import { Router } from "express";
import { param } from "express-validator";
import { City, Pincode } from "../../models/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middleware/validate.js";

const router = Router();

router.get("/:pincode", [param("pincode").matches(/^[1-9][0-9]{5}$/).withMessage("Enter a valid 6-digit PIN code")], validate, asyncHandler(async (req, res) => {
  const record = await Pincode.findOne({
    where: { pincode: req.params.pincode, is_serviceable: true, deleted_at: null },
    include: [{ model: City, attributes: ["name", "state"], where: { is_active: true, deleted_at: null }, required: true }],
  });
  res.json({
    success: true,
    data: record
      ? { available: true, city: record.City.name, state: record.City.state, message: `Manyata services are available in ${record.City.name}.` }
      : { available: false, city: null, message: "Online services are not available at this PIN code yet. Please contact our team for help." },
  });
}));

export default router;
