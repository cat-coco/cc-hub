package com.claudecode.hub;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.claudecode.hub")
@MapperScan(basePackages = "com.claudecode.hub.**.mapper")
public class ChHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChHubApplication.class, args);
    }
}
