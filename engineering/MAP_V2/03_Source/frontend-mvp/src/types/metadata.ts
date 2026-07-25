export interface MetadataNavItem {
  id: string;
  capabilityId?: string;
  label: string;
  path: string;
  icon?: string;
  navGroup?: string;
  navOrder?: number;
  visible?: boolean;
  requiredRoles?: string[];
  children?: MetadataNavItem[];
}

export interface SchemaObject {
  id: string;
  name: string;
  type: 'schema' | 'table' | 'column' | 'view';
  parentId?: string;
  children?: SchemaObject[];
  metadata?: Record<string, unknown>;
}

export interface ColumnDetail {
  id: string;
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  tags?: string[];
}
