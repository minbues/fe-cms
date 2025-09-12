import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAxios } from "../config/axiosConfig";
import { ChatSession, Message } from "../interfaces/chat.interface";
import endPoint from "../services";
import { showToast, ToastType } from "../shared/toast";

interface ChatState {
  chatSessions: ChatSession[];
  loading: boolean;
  error: string | null;
  getChatSessionSuccess: boolean;
  getMessageSuccess: boolean;
  messages: Message[];
}

const initialState: ChatState = {
  chatSessions: [],
  loading: false,
  error: null,
  getChatSessionSuccess: false,
  getMessageSuccess: false,
  messages: [],
};

export const getConversations = createAsyncThunk(
  "chat/sessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get<ChatSession[]>(
        endPoint.CHAT.CONVERSATIONS
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Lấy dữ liệu cuộc trò chuyện thất bại"
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getmessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get<Message[]>(
        endPoint.CHAT.GET_MESSAGES.replace(":id", conversationId)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Lấy dữ liệu cuộc trò chuyện thất bại"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLastMessage: (state, action) => {
      const msg = action.payload;
      const convIndex = state.chatSessions.findIndex(
        (session) => session.id === msg.conversationId
      );

      if (convIndex !== -1) {
        state.chatSessions[convIndex].lastMessage = {
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          createdAt: msg.createdAt,
        };
      }
    },
    addSession: (state, action) => {
      const exists = state.chatSessions.find((s) => s.id === action.payload.id);
      if (!exists) {
        state.chatSessions.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getChatSessionSuccess = false;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.chatSessions = action.payload;
        state.getChatSessionSuccess = true;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.getChatSessionSuccess = false;
        showToast(ToastType.ERROR, "Lấy dữ liệu cuộc trò chuyện thất bại");
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getMessageSuccess = false;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.getMessageSuccess = true;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.getMessageSuccess = false;
        showToast(ToastType.ERROR, "Lấy dữ liệu cuộc trò chuyện thất bại");
      });
  },
});

export const { setLastMessage, addSession } = chatSlice.actions;

export const sessionsSelector = (state: { chat: ChatState }) =>
  state.chat.chatSessions;

export const messagesByConverationIdSelector = (state: { chat: ChatState }) =>
  state.chat.messages;

export default chatSlice.reducer;
