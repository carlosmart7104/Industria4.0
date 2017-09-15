#include <ESP8266WiFi.h>
#include <WebSocketClient.h>

char* input = "";
char* ssid = "SSID"; // El nombre de la red WiFi
char* pass = "PASSWORD"; // La contraseña de la red WiFi
char* host = "192.168.0.10"; // La IP del servidor HTTP/WS
char* path = "/"; // La dirección de conexión al sitio ( "/" = raiz, por defecto )
int port = 8080; // El puerto del servidor HTTP/WS

WebSocketClient webSocketClient;

WiFiClient client;

void setup() {
  Serial.begin(115200);
  delay(500);
  WiFi.mode(WIFI_STA);
  delay(2000);
  wifi();
  delay(500);
  conectar();
}


void loop() {
  String data = "";
  if (client.connected()) {
    webSocketClient.getData(data);
    if (data.length() > 0) {
      Serial.println(data);
      data = "";
    }
    while (Serial.available() > 0) {
      delay(3); 
      if (Serial.available() > 0) {
        char c = Serial.read();
        data += c;
      } 
    }
    if (data.length() > 0) {
      webSocketClient.sendData(data);
    }
  } else {
    conectar();
  }
  delay(3000);
}

void readvar(char* x){
  String line;
  while(1){
    if (Serial.available() > 0) {
      line = Serial.readString();
      line.toCharArray(x,line.length()+1);
      break;
    }
    delay(100);
  }
}

void setport(){
  int line;
  while(1){
    if (Serial.available() > 0) {
      line = Serial.readString().toInt();
      port = line;
      break;
    }
    delay(50);
  }
}

void wifi(){
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void conectar(){
  while (!client.connect(host, port)) {
    delay(10);
  }
  webSocketClient.path = path;
  webSocketClient.host = host;
  while (!webSocketClient.handshake(client)) {
    delay(10);
  }
}

