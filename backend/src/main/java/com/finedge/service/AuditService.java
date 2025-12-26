package com.finedge.service;

import com.finedge.model.AuditLog;
import com.finedge.model.enums.AuditAction;
import com.finedge.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuditService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Autowired
    private com.finedge.repository.UserRepository userRepository;
    
    public void createAuditLog(String userId, AuditAction action, String entityType, 
                               String entityId, Map<String, Object> oldValues, 
                               Map<String, Object> newValues, HttpServletRequest request) {
        AuditLog log = new AuditLog();
        if (userId != null) {
            userRepository.findById(userId).ifPresent(log::setUser);
        }
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setOldValues(oldValues);
        log.setNewValues(newValues);
        log.setIpAddress(getClientIpAddress(request));
        log.setUserAgent(request.getHeader("User-Agent"));
        
        auditLogRepository.save(log);
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

