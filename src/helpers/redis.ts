import redisClient from "@/config/redis.config";

// Dùng để lấy giá trị (value) được lưu trữ tại một khóa (key) cụ thể.
const get = async (key: string) => {
    try {
        return await redisClient.get(key);
    } catch (err) {
        throw err;
    }
}

// Dùng để thiết lập hoặc ghi đè giá trị (value) cho một khóa (key).
// Nếu khóa đã tồn tại, giá trị hiện tại sẽ bị ghi đè.
const set = async (key: string, value: any) => {
    try {
        return await redisClient.set(key, value);
    } catch (err) {
        throw err;
    }
}

// Tăng giá trị số nguyên được lưu trữ tại một khóa (key) cụ thể lên một giá trị nhất định (increment).
const incrby = async (key: string, increment: number) => {
    try {
        return await redisClient.incrby(key, increment);
    } catch (err) {
        throw err;
    }
}

// Giảm giá trị số nguyên được lưu trữ tại một khóa (key) cụ thể xuống một giá trị nhất định (decrement).
const decrby = async (key: string, decrement: number) => {
    try {
        return await redisClient.decrby(key, decrement);
    } catch (err) {
        throw err;
    }
}

// Kiểm tra sự tồn tại của một khóa (key) trong Redis.
const exists = async (key: string) => {
    try {
        return await redisClient.exists(key);
    } catch (err) {
        throw err;
    }
}

// Đặt giá trị cho một khóa (key) chỉ khi khóa đó chưa tồn tại trong Redis.
// Trả về 1 nếu khóa được đặt thành công, 0 nếu khóa đã tồn tại.
const setnx = async (key: string, value: any) => {
    try {
        return await redisClient.setnx(key, value);
    } catch (err) {
        throw err;
    }
}

// Xóa một khóa (key) khỏi Redis.
const del = async (key: string) => {
    try {
        return await redisClient.del(key);
    } catch (err) {
        throw err;
    }
}

// 
const setex = async (key: string, value: any, seconds: number) => {
    try {
        return await redisClient.setex(key, seconds, value);
    }
    catch (err) {
        throw err;
    }
}

export {
    get,
    set,
    incrby,
    decrby,
    exists,
    setnx,
    del,
    setex
}