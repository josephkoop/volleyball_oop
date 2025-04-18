// PackageImpl.ts
import { Team } from "../interfaces/TeamHeader";
import { query } from '../config/db.js';

export class TeamClass implements Team {
    constructor(
        public id: number,
        public retailer_id: number,
        public customer_id: number,
        public status_id: number,
        public tracking_number: number,
        public shipping_method: number,
        public package_weight: number,
        public cost_weight: number,
    ) {}

    async updatePackage(status_id: number): Promise<void> {         //Watch if matching names throw error
        this.status_id = status_id;
        await query('UPDATE orders SET status_id = $1 WHERE id = $2', [status_id, this.id]);
    }

    async deletePackage(): Promise<void> {
        await query('DELETE FROM orders WHERE id = $1', [this.id]);
    }

    static async selectAll(): Promise<{ packages: any[], customers: any[], retailers: any[], statuses: any[] } | null> {
        const packages = await query(
            'SELECT orders.*, retailers.name as retailer_name, customers.name as customer_name, statuses.name as status_name FROM orders LEFT JOIN retailers ON retailers.id = orders.retailer_id LEFT JOIN customers ON customers.id = orders.customer_id LEFT JOIN statuses ON statuses.id = orders.status_id ORDER BY orders.id'
        );
        const customers1 = await query('SELECT * FROM customers ORDER BY id');
        const retailers1 = await query('SELECT * FROM retailers ORDER BY id');
        const statuses1 = await query('SELECT * FROM statuses ORDER BY id');

        if(packages.rows.length === 0 || customers1.rows.length === 0 || retailers1.rows.length === 0 || statuses1.rows.length === 0) return null;

        return { packages: packages.rows, customers: customers1.rows, retailers: retailers1.rows, statuses: statuses1.rows };
    }

    static async selectAll(): Promise<{ packages: any[], customers: any[], retailers: any[], statuses: any[] } | null> {
        const packages = await query(
            'SELECT orders.*, retailers.name as retailer_name, customers.name as customer_name, statuses.name as status_name FROM orders LEFT JOIN retailers ON retailers.id = orders.retailer_id LEFT JOIN customers ON customers.id = orders.customer_id LEFT JOIN statuses ON statuses.id = orders.status_id ORDER BY orders.id'
        );
        const customers1 = await query('SELECT * FROM customers ORDER BY id');
        const retailers1 = await query('SELECT * FROM retailers ORDER BY id');
        const statuses1 = await query('SELECT * FROM statuses ORDER BY id');

        if(packages.rows.length === 0 || customers1.rows.length === 0 || retailers1.rows.length === 0 || statuses1.rows.length === 0) return null;

        return { packages: packages.rows, customers: customers1.rows, retailers: retailers1.rows, statuses: statuses1.rows };
    }

    static async selectById(id: number, shippingMethod?: number): Promise<any> {
        const result = await query('SELECT * FROM orders WHERE id = $1 LIMIT 1', [id]);
        if(result.rows.length === 0) return null;

        const { OneDayImpl } = await import("./OneDayImpl");
        const { TwoDayImpl } = await import("./TwoDayImpl");

        const row = result.rows[0];
        const shipping_method = (shippingMethod == undefined) ? row.shipping_method : shippingMethod;

        if(shipping_method == 1){
            return new OneDayImpl(
                row.id,
                row.retailer_id,
                row.customer_id,
                row.status_id,
                row.tracking_number,
                shipping_method,
                row.package_weight,
                row.cost_weight
            );
        }else{
            return new TwoDayImpl(
                row.id,
                row.retailer_id,
                row.customer_id,
                row.status_id,
                row.tracking_number,
                shipping_method,
                row.package_weight,
                row.cost_weight
            );
        }
    }

    static async addPackage(retailer_id: number, customer_id: number, shipping_method: number, package_weight: number, cost_weight: number): Promise<void> {
        
       const { OneDayImpl } = await import("./OneDayImpl");
       const { TwoDayImpl } = await import("./TwoDayImpl");

        const tracking_number = Math.floor(Math.random() * 9000000000 + 1000000000);

        if(shipping_method === 1){
            const newPackage = new OneDayImpl(
                0,
                retailer_id,
                customer_id,
                1,
                tracking_number,
                shipping_method,
                package_weight,
                cost_weight
            );

            newPackage.savePackage();
        }else{
            const newPackage = new TwoDayImpl(
                0,
                retailer_id,
                customer_id,
                1,
                tracking_number,
                shipping_method,
                package_weight,
                cost_weight
            );

            newPackage.savePackage();
        }
    }



    

    static flat_fee: number = 30;
    static shipping_method = 1;

    async savePackage(): Promise<void> {
        const result = await query('INSERT INTO orders (retailer_id, customer_id, status_id, tracking_number, shipping_method, package_weight, cost_weight) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
            [
                this.retailer_id,
                this.customer_id,
                this.status_id,
                this.tracking_number,
                OneDayImpl.shipping_method,
                this.package_weight,
                this.cost_weight
            ]);
        this.id = result.rows[0].id;
    }

    async editPackage(id: number, retailer_id: number, customer_id: number, status_id: number, tracking_number: number, shipping_method: number, package_weight: number, cost_weight: number): Promise<void>{
        this.retailer_id = retailer_id;
        this.customer_id = customer_id;
        this.status_id = status_id;
        this.tracking_number = tracking_number;
        this.shipping_method = shipping_method;
        this.package_weight = package_weight;
        this.cost_weight = cost_weight;
        this.id = id;

        await query('UPDATE orders SET retailer_id = $1, customer_id = $2, status_id = $3, tracking_number = $4, shipping_method = $5, package_weight = $6, cost_weight = $7 WHERE id = $8', 
            [
                this.retailer_id,
                this.customer_id,
                this.status_id,
                this.tracking_number,
                OneDayImpl.shipping_method,
                this.package_weight,
                this.cost_weight,
                this.id,
            ]
        );
    }

    async calculatePackage(): Promise<object> {
        const totalCost1 = this.package_weight * this.cost_weight + OneDayImpl.flat_fee;
        const resultObject = { trackingNumber: this.tracking_number, flatFee: OneDayImpl.flat_fee, shippingMethod: OneDayImpl.shipping_method, packageWeight: this.package_weight, costWeight: this.cost_weight, totalCost: totalCost1 }

        return resultObject;
    }
}
