import axios from "axios";
import { config } from "../config/envConfig";
const { apiKey, baseUrl, clientId } = config.vietQR;

// API để kiểm tra số tài khoản
export const checkAccountInfo = async (accountNo: string, acqId: number) => {
  try {
    const response = await axios.post(
      `${baseUrl}/lookup`,
      {
        accountNumber: accountNo,
        bin: acqId,
      },
      {
        headers: {
          "x-client-id": clientId,
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const { code, desc, data } = response.data;

    // Kiểm tra mã lỗi
    switch (code) {
      case "00":
        // Thành công, trả về thông tin chủ tài khoản
        return { success: true, accountName: data?.accountName };

      case "42":
        // Số tài khoản không hợp lệ
        return { success: false, errorMessage: desc };

      case "41":
        // Ngân hàng không hỗ trợ
        return { success: false, errorMessage: desc };

      case "21":
        // Số tài khoản không hợp lệ (nhập số hoặc chữ, min 4 ký tự)
        return {
          success: false,
          errorMessage: desc,
        };

      case "22":
        // Mã định danh ngân hàng không hợp lệ (BIN)
        return {
          success: false,
          errorMessage: desc,
        };

      case "45":
        // Tất cả các provider đều đang bận
        return {
          success: false,
          errorMessage: desc,
        };

      default:
        // Mã lỗi không xác định
        return { success: false, errorMessage: "Có lỗi không xác định xảy ra" };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return {
      success: false,
      errorMessage: "Có lỗi xảy ra khi kiểm tra số tài khoản",
    };
  }
};
