#include <SoftwareSerial.h>

SoftwareSerial mySerial(10, 11);

String line = "";
int sensor_banda_anterior = 0;

void setup() {
  Serial.begin(4800);
  mySerial.begin(115200);
  pinMode(2,OUTPUT);
  pinMode(3,OUTPUT);
  digitalWrite(2, HIGH);
  digitalWrite(3, LOW);
}

void loop() {
  int sensor_banda = analogRead(A7);
  if (sensor_banda < 900 && sensor_banda_anterior >= 900){
    Serial.println("BOX");
    digitalWrite(2, LOW);
    mySerial.println("{\"user\": \"proceso\", \"incremento\": 1}");
    line = readline();
    String limite = line.substring(0,1);
    
    if(limite == "1"){
      empujar();
    }
    digitalWrite(2, HIGH);
    delay(500);
  }
  sensor_banda_anterior = sensor_banda;
}

String readline(){
  String line;
  while(1){
    if (mySerial.available()) {
      line = mySerial.readString();
      return line;
    }
    delay(100);
  }
}

void empujar(){
    while(analogRead(A6) > 850){
      digitalWrite(3, HIGH);
    }
    digitalWrite(3, LOW);
    delay(500);
}

