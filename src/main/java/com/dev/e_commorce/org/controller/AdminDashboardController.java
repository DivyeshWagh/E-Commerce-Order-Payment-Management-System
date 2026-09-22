package com.dev.e_commorce.org.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.service.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

	@Autowired
	private AdminDashboardService adminDashboardService;

	@GetMapping
	public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
		return ResponseEntity.ok(adminDashboardService.getDashboardMetrics());
	}
}
