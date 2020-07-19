package com.asan.osms.spring.configuration;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.asan.osms.bo"})
@EntityScan(basePackages = {"com.asan.osms.entity"})
@EnableJpaRepositories(basePackages = {"com.asan.osms.repository"})
@EnableTransactionManagement
public class RepositoryConfiguration {

}
