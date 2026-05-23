package cm.keycebet.sports.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SportDto {
    private Long id;
    private String name;
    private String icon;
    private boolean isActive;
    private int displayOrder;
}
