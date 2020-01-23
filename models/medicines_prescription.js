const mongoose = packageHelper.mongoose;

const MedicinesPrescriptionSchema = new mongoose.Schema({
  appointment_id: {
    type: Number,
    required: true
  },
  patient_prescription_id: {
    type: Number,
    required: true
  },
  medicine_charges: [{
    medicine_id: {
      type: Number
    },
    morning_dosage: {
      type: Boolean,
      default: false
    },
    noon_dosage: {
      type: Boolean,
      default: false
    },
    evening_dosage: {
      type: Boolean,
      default: false
    },
    quantity: {
      type: Number
    },
    charge: {
      type: Number
    },
    doctor_remarks: {
      type: String
    }
  }],
  prescription_charges: [{
    charge: {
      type: Number
    },
    doctor_remarks: {
      type: String
    }
  }]
}, {
  timestamps: true
});

const MedicinesPrescription = mongoose.model('medicines_prescription', MedicinesPrescriptionSchema);
module.exports = MedicinesPrescription;
