class ApiResponse {
  constructor({ success = true, message = 'OK', data = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;