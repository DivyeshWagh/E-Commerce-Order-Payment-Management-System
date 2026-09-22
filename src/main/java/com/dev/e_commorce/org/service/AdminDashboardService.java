package com.dev.e_commorce.org.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.e_commorce.org.entity.Order;
import com.dev.e_commorce.org.enums.OrderStatus;
import com.dev.e_commorce.org.repo.InventoryRepository;
import com.dev.e_commorce.org.repo.OrderRepository;
import com.dev.e_commorce.org.repo.ProductRepository;
import com.dev.e_commorce.org.repo.UserRepository;

@Service
public class AdminDashboardService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private InventoryRepository inventoryRepository;

	public Map<String, Object> getDashboardMetrics() {
		Map<String, Object> metrics = new HashMap<>();

		long totalUsers = userRepository.count();
		long totalProducts = productRepository.count();
		long totalOrders = orderRepository.count();

		List<Order> allOrders = orderRepository.findAll();
		double totalRevenue = allOrders.stream()
				.filter(o -> o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.SHIPPED || o.getStatus() == OrderStatus.DELIVERED)
				.mapToDouble(o -> o.getTotalprice() != null ? o.getTotalprice() : 0.0)
				.sum();

		long pendingOrders = allOrders.stream()
				.filter(o -> o.getStatus() == OrderStatus.PENDING)
				.count();

		int lowStockCount = inventoryRepository.findByAvailableQuantityLessThanEqual(5).size();

		List<Order> recentOrders = orderRepository.findAll(
				PageRequest.of(0, 5, Sort.by("createdAt").descending())
		).getContent();

		metrics.put("totalUsers", totalUsers);
		metrics.put("totalProducts", totalProducts);
		metrics.put("totalOrders", totalOrders);
		metrics.put("totalRevenue", totalRevenue);
		metrics.put("pendingOrders", pendingOrders);
		metrics.put("lowStockCount", lowStockCount);
		metrics.put("recentOrders", recentOrders);

		return metrics;
	}
}
