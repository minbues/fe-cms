import { useEffect, useState } from "react";
import {
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation,
  ChatContainer,
  ConversationHeader,
  Message,
  MessageList,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import PageContent from "../../components/common/PageContent";
import { Row, Col, Empty, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  addSession,
  getConversations,
  getMessages,
  messagesByConverationIdSelector,
  sessionsSelector,
  setLastMessage,
} from "../../redux/chatSlice";
import { SocketEvent } from "../../shared/enum";
import useSocket from "../../hooks/useSocket";
import { getUserId } from "../../redux/authSlice";
import { CloseOutlined, CommentOutlined } from "@ant-design/icons";

const ChatManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const reduxMessages = useSelector(messagesByConverationIdSelector);
  const sessions = useSelector(sessionsSelector);
  const [messages, setMessages] = useState(reduxMessages);
  const userId = useSelector(getUserId);
  const [searchTerm, setSearchTerm] = useState("");

  const { sendMessage, isConnected } = useSocket({
    [SocketEvent.NEW_MESSAGE]: (data) => {
      setMessages((prev) => [...prev, data]);
      dispatch(setLastMessage(data));
    },
    [SocketEvent.NEW_CONVERSATION]: (data) => {
      dispatch(addSession(data));
    },
  });

  useEffect(() => {
    setMessages(reduxMessages);
  }, [reduxMessages]);

  useEffect(() => {
    if (activeConversationId) {
      sendMessage(SocketEvent.JOIN_CONVERSATION, {
        conversationId: activeConversationId,
      });
    }
  }, [sendMessage, activeConversationId]);

  const handleConversationClick = (id: string) => {
    setActiveConversationId(id);
    dispatch(getMessages(id));
  };

  useEffect(() => {
    if (isConnected) {
      sendMessage(SocketEvent.JOIN_ADMIN, {});
    }
  }, [isConnected]);

  useEffect(() => {
    dispatch(getConversations());
  }, []);

  const handleSendMessage = (message: any) => {
    const newMessage = {
      conversationId: activeConversationId,
      senderId: userId,
      content: message,
      isRead: false,
    };

    sendMessage(SocketEvent.SEND_MESSAGE, newMessage);
  };

  const activeConversation = sessions.find(
    (conv) => conv.id === activeConversationId
  );

  const filteredSessions = sessions.filter((conv) =>
    conv.client.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContent
      title="Liên hệ hỗ trợ"
      contentSX={{
        backgroundColor: "#F0F2F5",
        border: "none",
        boxShadow: "none",
      }}
      bodySX={{
        padding: 0,
      }}
    >
      <Row
        gutter={32}
        style={{ height: "85vh", display: "flex", flexWrap: "nowrap" }}
      >
        <Col
          span={6}
          style={{
            borderRadius: 8,
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.04)",
            backgroundColor: "#FFFFFF",
            paddingLeft: 16,
            paddingRight: 0,
            paddingTop: 8,
          }}
        >
          <Sidebar
            position="left"
            scrollable
            style={{ width: "96%", margin: "auto" }}
          >
            <Input
              placeholder="Tìm kiếm liên hệ..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 12,
              }}
            />
            <ConversationList>
              {filteredSessions.length > 0 ? (
                filteredSessions.map((conv) => (
                  <Conversation
                    key={conv.id}
                    name={conv.client.fullName}
                    active={conv.id === activeConversationId}
                    onClick={() => handleConversationClick(conv.id)}
                    unreadDot={conv.lastMessage.senderId !== userId}
                    style={{
                      position: "relative",
                      border:
                        conv.id === activeConversationId
                          ? "1px solid #1890ff"
                          : "1px solid transparent",
                      borderRadius: 8,
                      padding: "8px",
                      transition: "border 0.3s",
                      marginBottom: 8,
                      backgroundColor:
                        conv.id === activeConversationId
                          ? "#E6F7FF"
                          : "#FFFFFF",
                      color:
                        conv.id === activeConversationId
                          ? "#1890ff"
                          : "#1F1F1F",
                    }}
                  />
                ))
              ) : (
                <Empty description="Không có liên hệ hỗ trợ" />
              )}
            </ConversationList>
          </Sidebar>
        </Col>
        <Col span={18}>
          <MainContainer style={{ width: "100%" }}>
            {activeConversation ? (
              <ChatContainer style={{ flex: 1, width: "100%" }}>
                <ConversationHeader>
                  <ConversationHeader.Content
                    userName={activeConversation.client.fullName}
                  />
                  <ConversationHeader.Actions>
                    <CloseOutlined
                      onClick={() => setActiveConversationId(null)}
                      style={{ fontSize: 16, color: "#999", cursor: "pointer" }}
                    />
                  </ConversationHeader.Actions>
                </ConversationHeader>

                <MessageList
                  typingIndicator={null}
                  style={{
                    height: "100%",
                    overflowY: "auto",
                    paddingRight: 8,
                  }}
                >
                  {messages.map((msg) => (
                    <Message
                      key={msg.id}
                      model={{
                        message: msg.content,
                        sender: msg.senderName || "",
                        direction:
                          msg.senderId === Number(userId!)
                            ? "outgoing"
                            : "incoming",
                        position: "single",
                      }}
                    />
                  ))}
                </MessageList>

                <MessageInput
                  placeholder="Nhập tin nhắn..."
                  attachButton={false}
                  onSend={handleSendMessage}
                />
              </ChatContainer>
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "24px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CommentOutlined style={{ fontSize: 46, color: "#999" }} />
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 16,
                      color: "#555",
                      fontWeight: "bold",
                    }}
                  >
                    Chọn một cuộc hội thoại để bắt đầu
                  </div>
                </div>
              </div>
            )}
          </MainContainer>
        </Col>
      </Row>
    </PageContent>
  );
};

export default ChatManagement;
