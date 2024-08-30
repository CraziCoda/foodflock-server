import mongoose from "mongoose";

export interface OrderI {
	userId: mongoose.Types.ObjectId;
	businessId: mongoose.Types.ObjectId;
	status: "pending" | "completed" | "cancelled";
	orderType: "delivery" | "pickup";
	deliveryAddress: string;
	deliveryCharge: number;
	acceptedByVendor: Boolean;
	markedAsCompleted: boolean;
	rating: number | null | undefined;
    awaitingDelivery: boolean;
}

export interface OrderedMeaI {
	order: mongoose.Types.ObjectId;
	quantity: number;
	price: number;
	meal: mongoose.Types.ObjectId;
}

export interface OrderedAccompanimentI {
	order: mongoose.Types.ObjectId;
	quantity: number;
	price: number;
	accompaniment: mongoose.Types.ObjectId;
}

export interface DeliveryInfoI {
    order: mongoose.Types.ObjectId;
    name: string;
    phone: string;
    contact_person_phone: string;
    delivery_location: string;
}

const OrderSchema = new mongoose.Schema<OrderI>(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Business",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "completed", "cancelled"],
			default: "pending",
		},
		orderType: {
			type: String,
			enum: ["delivery", "pickup"],
			required: true,
		},
		deliveryAddress: {
			type: String,
			default: "",
		},
		deliveryCharge: {
			type: Number,
			required: true,
			default: 0,
		},
		acceptedByVendor: {
			type: Boolean,
			required: true,
			default: false,
		},
		markedAsCompleted: {
			type: Boolean,
			required: true,
			default: false,
		},
        awaitingDelivery: {
            type: Boolean,
            required: true,
            default: true,
        },
		rating: {
			type: Number,
			default: null,
			min: 0,
			max: 5,
		},
	},
	{ timestamps: true }
);

const OrderedMealSchema = new mongoose.Schema<OrderedMeaI>({
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	meal: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Meal",
		required: true,
	},
});

const OrderedAccompanimentSchema = new mongoose.Schema<OrderedAccompanimentI>({
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	accompaniment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Accompaniment",
		required: true,
	},
});

const DeliveryInfoSchema = new mongoose.Schema<DeliveryInfoI>({
    order: {
        ref: "Order",
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    contact_person_phone: {
        type: String,
        required: true,
    },
    delivery_location: {
        type: String,
        required: true,
    }
});

const Order = mongoose.model("Order", OrderSchema);
const OrderedMeal = mongoose.model("OrderedMeal", OrderedMealSchema);
const OrderedAccompaniment = mongoose.model(
	"OrderedAccompaniment",
	OrderedAccompanimentSchema
);
const DeliveryInfo = mongoose.model("DeliveryInfo", DeliveryInfoSchema);

export { Order, OrderedMeal, OrderedAccompaniment,  DeliveryInfo};
