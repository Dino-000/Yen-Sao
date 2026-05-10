package com.yensao.product.repository;

import com.yensao.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCompanyIdAndActiveTrue(Long companyId, Pageable pageable);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryAndActiveTrue(String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:companyId IS NULL OR p.companyId = :companyId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> search(@Param("name") String name,
                         @Param("category") String category,
                         @Param("companyId") Long companyId,
                         @Param("minPrice") BigDecimal minPrice,
                         @Param("maxPrice") BigDecimal maxPrice,
                         Pageable pageable);

    List<Product> findByCompanyId(Long companyId);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.active = true")
    List<String> findAllCategories();
}
