import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  period?: string;
  link?: string;
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
  period,
  link,
  className,
}: StatsCardProps) => {
  const CardWrapper = link ? Link : 'div';
  const cardProps = link ? { to: link } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-lg hover:shadow-temple-saffron/10 border border-border/50 cursor-pointer group",
        link && "hover:border-temple-saffron/50",
        className
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {period && (
              <Badge variant="outline" className="text-xs">
                {period}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-temple-cream to-temple-saffron/20 rounded-lg group-hover:scale-105 transition-transform">
              {icon}
            </div>
            {link && (
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-temple-saffron transition-colors">
            {value}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mb-3">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    trend.isPositive
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {trend.value}
                </span>
              </div>
              {link && (
                <Button variant="ghost" size="sm" className="text-xs text-temple-saffron opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};