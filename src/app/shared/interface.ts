export interface UserAuth {
    email: string;
    password: string;
    returnSecureToken?: boolean
}

export interface AuthResponse {
    [x: string]: string;
    token: string
}
 export interface ServerResponse {
    success:boolean;
    data: any;
}
 export interface DataResponse {
     success:boolean;
     data: {
         collection: Good[];
         meta: Meta;
     };
 }

 export interface Meta {
     count: number;
     current_page: number;
     from: number;
     last_page: number;
     per_page: number;
     to: number;
     total: number;
 }

 export interface User {
    id?: number;
    first_name?: string;
    last_name?: string;
    email: string;
    password?: string;
    role?: string
    phone?: string,
    country?: string,
    city?: string;
    api_token?: string;
}
export  interface  Area {
    id?:number;
    title: string;
    area_categories: Category[];
    sales?:Sale[];
}

export interface  Category {
    id?:number;
    title: string;
    area_id?: number;
    area_category: Area;
    sales?:Sale[];
}

export interface  Pivot {
    count: number;
}

export interface  Good {
    id?: number;
    title: string;
    photo: string;
    feature: string;
    count: number;
    pivot: Pivot;
    price: number;
    brand: string;
    rating:number;
    category_id: number;
    category: Category;
    sales?: Sale[];
    reviews?: Review[];
    max_sale?: number;
    min_price?: number;
}
export interface  Pivot {
    count: number;
    order_id: number;
}

export interface  Order {
    id?:number;
    buyer_id?: number;
    payment?: string;
    delivery?: string;
    goods_is_paid?: string;
    sum?:number;
    order_goods?: Good[];
    created_at?: Date;
    deleted_at?: Date;
    updated_at?: Date;
    info?: string;
}

export interface  Review {
    id?: number;
    text: string;
    mark:number;
    author?: User;
    updated_at?: Date;
}
export interface  Sale {
    value_percentage:number;
}

export interface QueryParam {
    category_id?:number;
    brand?: string;
    sortBy?:string;
    sortOrder?:string;
    search?:string;
    area_id?:number;
    order_id?: number;
    current_page?: number;
}

export interface UserResponseModel {
    success: boolean;
    data: {
        id?: number;
        first_name?: string;
        last_name?: string;
        email: string;
        password?: string;
        role?: string
        phone?: string,
        country?: string,
        city?: string;
        api_token?: string
    };
}
