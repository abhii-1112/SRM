import Customer from "../models/customers.js";

export const getVisitcount = async (req, res) => {
    try {
        const totalVisit = await Customer.aggregate([
            {$groups: {_id: null, total: { $sum: "$visitCount" }}}
        ]);
        return res.status(200).json({
            totalVisit: totalVisit.length ? totalVisit[0].total : 0,
          });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}